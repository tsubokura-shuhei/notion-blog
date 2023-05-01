import { GetStaticProps } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  getAllPosts,
  getAllTags,
  getPostsForTopPage,
} from "../../lib/notionAPI";
import { SinglePost } from "../components/Post/SinglePost";
import Link from "next/link";
import Tag from "../components/Tag/Tag";

// const inter = Inter({ subsets: ["latin"] });

export const getStaticProps = async () => {
  const numberPosts = await getPostsForTopPage(4);
  const allTags = await getAllTags();

  return {
    props: {
      numberPosts,
      allTags,
    },
    revalidate: 60 * 60 * 6,
  };
};

export default function Home({ numberPosts, allTags }) {
  return (
    <div className="container h-full w-full mx-auto">
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">Notion Blog</h1>
        {numberPosts.map((post: any) => (
          <div className="mx-4" key={post.id}>
            <SinglePost
              title={post.title}
              description={post.description}
              date={post.date}
              tags={post.tags}
              slug={post.slug}
              isPaginationPage={false}
            />
          </div>
        ))}
        <Link
          href="/posts/page/1"
          className="mb-6 lg:w-1/2 mx-auto rounded-md px-5 block text-right"
        >
          ...もっと見る
        </Link>
        <Tag tags={allTags} />
      </main>
    </div>
  );
}
