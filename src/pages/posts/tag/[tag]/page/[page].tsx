import { GetStaticPaths, GetStaticProps } from "next";
import Paginations from "../../../../../components/Pagination/Paginations";

import SinglePost from "../../../../../components/Post/SinglePost";
import {
  getAllTags,
  getNumberOfPages,
  getNumberOfPagesByTag,
  getPostsByPage,
  getPostsByTagPage,
  getPostsForTopPage,
} from "../../../../../../lib/notionAPI";
import Tag from "../../../../../components/Tag/Tag";

export const getStaticPaths: GetStaticPaths = async () => {
  const allTags = await getAllTags();
  let params = [];

  await Promise.all(
    //非同期処理の複数回使用の際に記述 await Promise.all
    allTags.map((tag: string) => {
      return getNumberOfPagesByTag(tag).then((numberOfPagesByTag: number) => {
        for (let i = 0; i < numberOfPagesByTag; i++) {
          params.push({ params: { tag: tag, page: i.toString() } });
        }
      });
    })
  );

  // console.log(params);

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
  const currentPage: string = context.params?.page.toString();
  const currentTag: string = context.params?.tag.toString();

  const upperCaseCurrentTag =
    currentTag.charAt(0).toUpperCase() + currentTag.slice(1);

  const posts = await getPostsByTagPage(
    upperCaseCurrentTag,
    parseInt(currentPage, 10)
  );

  const numberOfPagesByTag = await getNumberOfPagesByTag(upperCaseCurrentTag);

  const allTags = await getAllTags();

  return {
    props: {
      posts,
      numberOfPagesByTag,
      currentTag,
      allTags,
    },
    revalidate: 60 * 60 * 6,
  };
};

const BlogTagPageList = ({
  numberOfPagesByTag,
  posts,
  currentTag,
  allTags,
}) => {
  return (
    <div className="container h-full w-full mx-auto">
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">Notion Blog</h1>
        <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
          {posts.map((post: any) => (
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
        <Paginations numberOfPage={numberOfPagesByTag} tag={currentTag} />
        <Tag tags={allTags} />
      </main>
    </div>
  );
};

export default BlogTagPageList;
