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
import { useEffect, useState } from 'react';


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



export default function Home({postsPagination}: HomeProps) {
  // TODO
  const [postItens, setPostItens ] = useState<PostPagination>(postsPagination) 
  

  useEffect(() => {

  }, [postItens])

  async function handleLoadMorePosts(){
    if(!postsPagination.next_page) {
      return;
    }

    const response = await fetch(postItens.next_page)
      .then(res => res.json())

    setPostItens({
      next_page: response.next_page,
      results: [...postItens.results, ...response.results]
    });

    console.log(response)
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
                    <span><FiCalendar/>{post.first_publication_date}</span>
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
    pageSize: 2
  });

  const pagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map(result => {
      const publicationDate = format(
        new Date(result.first_publication_date),
        "dd MMM yyyy",
        {
          locale: ptBR,
        }
      )

      return {
        uid: result.uid,
        first_publication_date: publicationDate,
        data: result.data,
      }
    })
    
  }


  // console.log(postsResponse)

  return {
    props: {postsPagination: pagination}
  }
  // TODO
};
