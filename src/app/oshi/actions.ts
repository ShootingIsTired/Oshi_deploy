"use server";

import { redirect } from "next/navigation";
import { eq, desc, sql, like, and, } from "drizzle-orm";

import { z } from "zod";

import  {initializeDb} from "@/db";
import {  oshiInfoTable, keepTable, likeTable, picTable, commentTable, tagTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import type { User, OshiInfo} from "@/lib/types";

const createOshiSchema = z.object({
  name: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  igUrl: z.string().min(1).max(100),
});

// Add a new oshi
export async function addOshi(
  oshiData: Omit<OshiInfo, 'id'>
) {
  const db = await initializeDb();
  // Check if user is logged in
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}`);
  }

  // Check if the input data is valid
  try {
    createOshiSchema.parse(oshiData);
  } catch (error) {
    throw new Error("Input data is invalid");
  }

  const newOshi: OshiInfo = await db.transaction(async (trx) => {
    // Create a new oshi
    const [addedOshi] = await trx
      .insert(oshiInfoTable)
      .values({
        ...oshiData,
        igUrl: oshiData.igUrl,
      })
      .returning();
    const oshiId = addedOshi.displayId


    await trx.insert(keepTable).values({
      userId: userId,
      oshiId: oshiId,
    });

    return {
      id: addedOshi.displayId,
      name: addedOshi.name,
      country: addedOshi.country,
      igUrl: addedOshi.igUrl,
    };
  });

  return newOshi;
}

// Keep an oshi
export async function keepOshi(userId: User['id'], oshiId: OshiInfo['id']) {
  const db = await initializeDb();
  try {
    // Check if the user has already kept this oshi
    const existingKeeps = await db.query.keepTable.findMany({
      where: and(eq(keepTable.userId, userId), eq(keepTable.oshiId, oshiId)),
    });

    const existingKeep = existingKeeps[0]; // Take the first record if available    

    if (existingKeep) {
      throw new Error("You have already kept this oshi.");
    }

    // Insert a new keep record
    await db.insert(keepTable).values({
      userId: userId,
      oshiId: oshiId,
    });

    return { message: "Oshi kept successfully." };
  } catch (error) {
    // Handle any errors here
    throw error; // or return a custom error message
  }
}

// Remove a kept oshi
export async function removeKeepOshi(userId: User['id'], oshiId: OshiInfo['id']) {
  const db = await initializeDb();
  // Delete the keep record for the given userId and oshiId
  await db.delete(keepTable)
    .where(and(eq(keepTable.userId, userId), eq(keepTable.oshiId, oshiId)))
    .execute();

}

export async function isOshiKeptByUser(userId: User['id'], oshiId: OshiInfo['id']): Promise<boolean> {
  const db = await initializeDb();
  const existingKeeps = await db.query.keepTable.findMany({
    where: and(eq(keepTable.userId, userId), eq(keepTable.oshiId, oshiId)),
  });

  // If the array is not empty, then the oshi is kept by the user
  return existingKeeps.length > 0;
}

// Like a pic
export async function likePic(userId: User['id'], picId: string) {
  const db = await initializeDb();
  // Insert a like into the likeTable
  const existingLike = await db.query.likeTable.findMany({
    where: and(eq(likeTable.userId, userId), eq(likeTable.picId, picId)),
  });

  if (existingLike.length === 0) {
    // Only insert if the like doesn't exist
    await db.insert(likeTable).values({
      userId: userId,
      picId: picId,
    }).execute();
  } else {
    // Optionally, handle the case where the like already exists
    console.log("User has already liked this picture.");
  }
}

// Like a pic
export async function unlikePic(userId: User['id'], picId: string) {
  const db = await initializeDb();
  // Delete the like record for the given userId and picId
  await db.delete(likeTable)
    .where(and(eq(likeTable.userId, userId), eq(likeTable.picId, picId)))
    .execute();
}

export async function isPicLikedByUser(userId: User['id'], picId: string): Promise<boolean> {
  const db = await initializeDb();  
  try {
        const likes = await db.query.likeTable.findMany({
            where: and(eq(likeTable.userId, userId), eq(likeTable.picId, picId)),
        });

        // If the array is not empty, then the picture is liked by the user
        return likes.length > 0;
    } catch (error) {
        // Handle any errors here
        console.error('Error in checking if picture is liked by user:', error);
        throw error; // or handle it as appropriate for your application
    }
}


// Get the user's liked pics
export async function getLikedPicsByUser(userId: User['id']) {
  const db = await initializeDb();
  // Query the likeTable for this user's liked pics
  const likedPics = await db.query.likeTable.findMany({
    where: eq(likeTable.userId, userId),
    with: {
      pic: {
        columns: {
          displayId: true,
          imageUrl: true,
          oshiId: true,
        },
      },
    },
  });
  const defaultImageUrl = '/defaultProfile.png';
  const pics = likedPics.map((item) => ({
    id: item.pic.displayId,
    imageUrl: item.pic.imageUrl || defaultImageUrl,
    oshiId: item.pic.oshiId,
  }));
  return pics;
}

// Get the user's keeps
export async function getKeepsByUser(userId: User['id']) {
  const db = await initializeDb();
  // Query the keepTable for this user's keeps
  const keeps = await db.query.keepTable.findMany({
    where: eq(keepTable.userId, userId),
    with: {
      oshi: {
        columns: {
          displayId: true,
          name: true,
          country: true,
          igUrl: true,
        },
      },
    },
  });

  // Fetch the most liked picture and keep count for each oshi
  const oshisWithPicturesAndCounts = await Promise.all(keeps.map(async (item) => {
    const mostLikedPicture = await getMostLikedOshiPicture(item.oshi.displayId);
    const keepCount = await countKeeps(item.oshi.displayId);
    return {
      id: item.oshi.displayId,
      name: item.oshi.name,
      country: item.oshi.country,
      igUrl: item.oshi.igUrl,
      imageUrl: mostLikedPicture ? mostLikedPicture.imageUrl : '/defaultProfile.png',
      keepCount
    };
  }));

  return oshisWithPicturesAndCounts;
}



// Get all the oshis
export async function getAllOshis() {
  const db = await initializeDb();
  // Query all oshi records from oshiInfoTable
  // findMany without any specific conditions will return all records from the table
  const oshis = await db.query.oshiInfoTable.findMany();
  return {
    oshis: oshis.map((oshi) => ({
      id: oshi.displayId,
      name: oshi.name,
      country: oshi.country,
      igUrl: oshi.igUrl,
    })),
  };
}

// Get a single oshi by its display ID
export async function getOshi(oshiDisplayId: OshiInfo['id']) {
  const db = await initializeDb();
  // Query the oshiInfoTable for an oshi with the specified display ID
  const oshis = await db.query.oshiInfoTable.findMany({
    where: eq(oshiInfoTable.displayId, oshiDisplayId),
    limit: 1,
    columns: {
      displayId: true,
      name: true,
      country: true,
      igUrl: true,
    },
  });

  const oshi = oshis[0];

  return {
    id: oshi.displayId,
    name: oshi.name,
    country: oshi.country,
    igUrl: oshi.igUrl,
  };
}

// Post a comment
export async function postComment(userId: User['id'], oshiId: OshiInfo['id'], commentText: string) {
  const db = await initializeDb();
  // Insert a comment into the commentTable
  await db.insert(commentTable).values({
    userId: userId,
    oshiId: oshiId,
    comment: commentText,
    timestamp: new Date(),  // Assuming current time as the timestamp
  });
  // You might want to handle errors or return the created comment
}
export async function getComments(oshiId: OshiInfo['id']) {
  const db = await initializeDb();
  try {
    // Fetching comments for the given oshiId, sorted by timestamp
    const comments = await db.query.commentTable.findMany({
      where: eq(commentTable.oshiId, oshiId),
      orderBy: [commentTable.timestamp], // or .desc() for descending order
    });

    // Return the sorted comments
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}




// Add a tag to an oshi
export async function addTagToOshi(oshiId: OshiInfo['id'], tagText: string) {
  const db = await initializeDb();
  // Insert a tag into the tagTable
  await db.insert(tagTable).values({
    oshiId: oshiId,
    tag: tagText,
  });
}

export async function removeTagsFromOshi(oshiId: OshiInfo['id'], tag: string) {
  const db = await initializeDb();
  try {
    // Delete the tag associated with the oshiId
    await db.delete(tagTable)
      .where(and(eq(tagTable.oshiId, oshiId), eq(tagTable.tag, tag)))
      .execute();

  } catch (error) {
    throw new Error("Failed to remove tag");
  }
}

export async function getTagsByOshi(oshiId: OshiInfo['id']) {
  const db = await initializeDb();
  // Query the tagTable for tags linked to the specified oshiId
  const tags = await db.query.tagTable.findMany({
    where: eq(tagTable.oshiId, oshiId),
    columns: {
      tag: true, // Retrieve only the tag text
    },
  });

  // Extract the tag text from the query result
  const tagList = tags.map(tagEntry => tagEntry.tag);

  return tagList;
}

interface PictureWithLikes {
  displayId: string;
  imageUrl: string;
  likes: {
    like_count: number;
  };
}

export async function getOshiPicturesSortedByLikes(oshiId: OshiInfo['id']) {
  const db = await initializeDb();
  const pictures = await db.query.picTable.findMany({
    where: eq(picTable.oshiId, oshiId),
  });

  const picturesWithLikes = await Promise.all(pictures.map(async (pic) => {
    const likes = await db.query.likeTable.findMany({
      where: eq(likeTable.picId, pic.displayId),
    });
    return {
      id: pic.displayId,
      imageUrl: pic.imageUrl,
      likeCount: likes.length, // Count the number of likes
    };
  }));

  return picturesWithLikes.sort((a, b) => b.likeCount - a.likeCount);
}

export async function getMostLikedOshiPicture(oshiId: OshiInfo['id']) {
  const db = await initializeDb();
  const pictures = await db.query.picTable.findMany({
    where: eq(picTable.oshiId, oshiId),
  });

  let mostLikedPicture = null;
  let maxLikes = 0;

  for (const pic of pictures) {
    const likes = await db.query.likeTable.findMany({
      where: eq(likeTable.picId, pic.displayId),
    });
    const likeCount = likes.length;
    if (likeCount >= maxLikes) {
      maxLikes = likeCount;
      mostLikedPicture = {
        id: pic.displayId,
        imageUrl: pic.imageUrl,
        likeCount,
      };
    }
  }

  return mostLikedPicture;
}

// Get a single oshi by its display ID
export async function getMostKeepedOshiByCountry(country: string) {
  const db = await initializeDb();
  const oshis = await db.query.oshiInfoTable.findMany({
    where: eq(oshiInfoTable.country, country),
  });

  let mostKeepedOshi = null;
  let maxKeeps = 0;

  for (const oshi of oshis) {
    const keeps = await db.query.keepTable.findMany({
      where: eq(keepTable.oshiId, oshi.displayId),
    });

    const keepCount = keeps.length;
    if (keepCount >= maxKeeps) {
      maxKeeps = keepCount;
      mostKeepedOshi = {
        id: oshi.displayId,
        name: oshi.name,
        keepCount,
      };
    }
  }
  return mostKeepedOshi;
}

// Get five most keeped oshis by country
export async function getOshiRankingByCountry(country: string) {
  const db = await initializeDb();
  const oshis = await db.query.oshiInfoTable.findMany({
    where: eq(oshiInfoTable.country, country),
  });

  const oshiRanking = await Promise.all(oshis.map(async (oshi) => {
    const keeps = await db.query.keepTable.findMany({
      where: eq(keepTable.oshiId, oshi.displayId),
    });
    return {
      id: oshi.displayId,
      name: oshi.name,
      keepCount: keeps.length, // Count the number of keeps
    };
  }));

  // Sort the oshis by keepCount in descending order and take the top five
  return oshiRanking.sort((a, b) => b.keepCount - a.keepCount).slice(0, 5);
}
// Define the structure of the picture data
interface PictureData {
  oshiId: OshiInfo['id'];
  imageUrl: string;
}

// Add a new picture
export async function addPicture(pictureData: PictureData) {
  const db = await initializeDb();
  // Insert the new picture into the picTable
  const [addedPicture] = await db.insert(picTable).values({
    oshiId: pictureData.oshiId,
    imageUrl: pictureData.imageUrl,
  }).returning();

  // Return the added picture data
  return {
    id: addedPicture.displayId,
    oshiId: addedPicture.oshiId,
    imageUrl: addedPicture.imageUrl,
  };
}

//Count how many people kept the oshi with oshi id
export async function countKeeps(oshiId: OshiInfo['id']) {
  const db = await initializeDb();
  const keeps = await db.query.keepTable.findMany({
    where: eq(keepTable.oshiId, oshiId),
  });
  return keeps.length;
}

export async function getOshisByTag(tag: string) {
  const db = await initializeDb();
  const uppercaseTag = tag.toUpperCase();
  // Query the tagTable for oshis with the specified tag
  const oshis = await db.query.tagTable.findMany({
    where: like(tagTable.tag, `%${uppercaseTag}%`),
      columns: {
          oshiId: true, // Retrieve only the oshi ID
      },
  });
  //Extract the oshi ID from the query result
  const filteredOshiIds = oshis.map((item) => item.oshiId);
  return filteredOshiIds;
}

// Get the total like count for a specific picture
export async function getLikeCountByPic(picId: string) {
  const db = await initializeDb();
  // Query the likeTable to count likes for the given picture ID
  const likeCount = await db.query.likeTable.findMany({
    where: eq(likeTable.picId, picId),
  });

  return likeCount.length;
}

// Functions for statistics
// Function to count users
export async function countUsers() {
  const db = await initializeDb();
  const userCount = await db.query.usersTable.findMany();
  return userCount.length;
}

// Function to count oshis
export async function countOshis() {
  const db = await initializeDb();
  const oshiCount = await db.query.oshiInfoTable.findMany();
  return oshiCount.length;
}

// Function to count total pics
export async function countPics() {
  const db = await initializeDb();
  const picCount = await db.query.picTable.findMany();
  return picCount.length;
}

interface TagWithCount {
  tag: string;
  count: number; // Make sure this matches the actual data type returned by your database
}

// // Function to get the 10 most appeared tags
export async function getTopTags(limit = 10) {
  const db = await initializeDb();
  const res = await db.select({
    tag: tagTable.tag,
    count: sql`COUNT(${tagTable.id})`,
  })
    .from(tagTable)
    .groupBy(tagTable.tag)
    .orderBy(desc(sql`COUNT(${tagTable.id})`))
    .limit(limit)
    .execute();

  return res as TagWithCount[];
};