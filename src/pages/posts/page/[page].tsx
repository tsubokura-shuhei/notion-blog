import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import Paginations from "../../../components/Pagination/Paginations";

import SinglePost from "../../../components/Post/SinglePost";
import {
  getAllTags,
  getNumberOfPages,
  getPostsByPage,
  getPostsForTopPage,
} from "../../../../lib/notionAPI";
import { Pagination } from "swiper";
import Tag from "../../../components/Tag/Tag";

export const getStaticPaths: GetStaticPaths = async () => {
  const numberOfPage = await getNumberOfPages();

  let params = [];
  for (let i = 0; i < numberOfPage; i++) {
    params.push({ params: { page: i.toString() } });
  }

  return {
    paths: params,
    fallback: "blocking",
  };
};

// const inter = Inter({ subsets: ["latin"] });
export type Props = {
  numberPosts: any;
};

export const getStaticProps = async (context) => {
  const currentPage = context.params?.page;
  const postsByPage = await getPostsByPage(
    parseInt(currentPage.toString(), 10)
  );
  const numberOfPage = await getNumberOfPages();

  const allTags = await getAllTags();

  return {
    props: {
      postsByPage,
      numberOfPage,
      allTags,
    },
    revalidate: 60 * 60 * 6,
  };
};

const BlogPageList = ({ postsByPage, numberOfPage, allTags }) => {
  return (
    <div className="container h-full w-full mx-auto">
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">Notion Blog</h1>
        <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
          {postsByPage.map((post: any) => (
            <div key={post.id}>
              <SinglePost
                title={post.title}
                description={post.description}
                date={post.date}
                tags={post.tags}
                slug={post.slug}
                isPaginationPage={true}
              />
            </div>
          ))}
        </section>
        <Paginations numberOfPage={numberOfPage} tag={""} />
        <Tag tags={allTags} />
      </main>
    </div>
  );
};

export default BlogPageList;
