import {getKeepsByUser, } from  "../actions";
import linkPic from "../_components/linkPic";
import MyKeptOshis from "./_components/myKeptOshis";
import MyOshiGallery from "./_components/myOshiGallery";
export default function myOshiPage() {
    return (
      <main className="h-full w-full overflow-auto bg-gray-100">
        <MyKeptOshis />
        {/* <MyOshiGallery/> */}
      </main>
    );
  }
