// Updated User type to reflect the schema in schema.ts
export type User = {
  id: string; // Assuming 'id' corresponds to 'displayId' in the usersTable
  name: string;
  email: string;
  provider: "github" | "credentials" | "google";
  // Adding hashedPassword as it is present in the usersTable
  hashedPassword: string;
};

// Updated Project type to correspond to oshiInfoTable in schema.ts
export type OshiInfo = {
  id: string; // Assuming 'id' corresponds to 'displayId' in the oshiInfoTable
  name: string;
  country: string;
  igUrl: string;  // The 'ig' field is based on the schema, but it was duplicated as 'country' in the provided schema.ts
};

// The Keep table in schema.ts does not have a direct correlation to Project or Task,
// but it seems to represent a "Keep" entity where a user keeps an oshi.
export type Keep = {
  id: string; // Assuming 'id' corresponds to the primary key in the keepTable
  userId: string; // Corresponding to the 'user_id' field in keepTable
  oshiId: string; // Corresponding to the 'oshi_id' field in keepTable
};

// The Like table represents a "Like" entity.
export type Like = {
  id: string; // Assuming 'id' corresponds to the primary key in the likeTable
  userId: string; // Corresponding to the 'user_id' field in likeTable
  picId: string; // Corresponding to the 'pic_id' field in likeTable
};

// The Pic table represents a picture entity.
export type Pic = {
  id: string; // Assuming 'id' corresponds to 'displayId' in the picTable
  oshiId: string; // Corresponding to the 'oshi_id' field in picTable
  imageUrl: string; // New field for the image URL
  likeCount?: number; // New field for the number of likes
};

// The Tag table corresponds to the oshi_tag entity in the schema.ts
export type Tag = {
  id: string; // Assuming 'id' corresponds to 'displayId' in the tagTable
  oshiId: string; // Corresponding to the 'oshi_id' field in tagTable
  tag: string; // Corresponding to the 'tag' field in tagTable
};

// The Comment type corresponds to the comment table entity in schema.ts
export type Comment = {
  id: string; // Assuming 'id' corresponds to 'displayId' in the commentTable
  userId: string; // Corresponding to the 'user_id' field in commentTable
  oshiId: string; // Corresponding to the 'oshi_id' field in commentTable
  comment: string; // Corresponding to the 'comment' field in commentTable
  timestamp: Date; // Corresponding to the 'timestamp' field in commentTable
};
