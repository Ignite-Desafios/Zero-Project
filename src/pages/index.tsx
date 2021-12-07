import { GetStaticProps } from 'next';
import Prismic from "@prismicio/client";
import Link from "next/link";

import { getPrismicClient } from '../services/prismic';
import Head from "next/head";

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from "react-icons/fi";
import { useState } from 'react';
import { formatDate } from '../utils/formatDate';


interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

function parseResult(result: any[]): Post[] {
  return result.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      ...post.data,
    },
  }));
}

export default function Home({postsPagination}: HomeProps) {
  // TODO
  const [postItens, setPostItens ] = useState<PostPagination>(postsPagination) 
  

  async function handleLoadMorePosts(){
    if(!postsPagination.next_page) {
      return;
    }

    const response = await fetch(postItens.next_page)
      .then(res => res.json())

    setPostItens({
      next_page: response.next_page,
      results: [...postItens.results, ...parseResult(response.results)]
    });
  }

  return (
    <>
    <Head>
      <title>SpaceTravelling | Home</title>
    </Head>
    <main className={styles.container}>
      <div className={commonStyles.contentWrapper}>

        <ul>
            {postItens.results.map(post => (
                <li key={post.uid}>
                  <Link href={`/post/${post.uid}`}>
                    <a>{post.data.title}</a>
                  </Link>
                  <p>{post.data.subtitle}</p>
                  <div className={commonStyles.infoSession}>
                    <span><FiCalendar/>{formatDate(post.first_publication_date)}</span>
                    <span><FiUser/>{post.data.author}</span>
                  </div>
                </li>
            ))}
            {postItens.next_page && (
              <button onClick={() => handleLoadMorePosts()}>
                Carregar mais posts
              </button>
            )}
        </ul>
      </div>
    </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at("document.type", "posts")
  ], {
    fetch: ["title", "subtitle", "author"],
    pageSize: 2
  });


  const posts: Post[] = parseResult(postsResponse.results);

  return {
    revalidate: 60 * 60, // 1 hora
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page,
      },
    },
  };
  // TODO
};
