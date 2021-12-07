import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import { FiCalendar, FiUser, FiClock } from "react-icons/fi";
import Prismic from "@prismicio/client";
import Head from "next/head";
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}: PostProps) {
  
  const readTiming = "4 min";

  return (
    <>
    <main className={styles.container}>
      <div className={commonStyles.contentWrapper}>
        
        {post ? (
          <article>
            <Head>
              <title>SpaceTraveling | {post.data.title}</title>
            </Head>

            <img src={post.data.banner.url} alt="BannerPost" />

            <h1>{post.data.title}</h1>
            <div className={commonStyles.infoSession}>
              <span><FiCalendar/>{post.first_publication_date}</span>
              <span><FiUser/>{post.data.author}</span>
              <span><FiClock/>{readTiming}</span>
            </div>

            {post.data.content.map(content => (
              <div className={styles.group}>
                <h2 key={content.heading}>{content.heading}</h2>
                {content.body.map(text => (
                  <p key={text.text.slice(0,20)}>{text.text}</p>
                ))}
              </div>
            ))}


          </article>
        ) : (
          <h1 className={styles.loading}>Carregando...</h1>
        )}

      </div>
    </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  
  const postsResponse = await prismic.query([
    Prismic.predicates.at("document.type", "posts")
  ], {});

  const paths = postsResponse.results.map(result => {
    return {
      params: {
        slug: result.uid
      }
    }
  })
  
  
  return {
    paths: paths,
    fallback: true 
    // true: gera as requisições pelo lado do browser (layout shifting)
    // false: se não existir o endereço no path, retorna 404
    // blocking: tipo o true, porém no lado do servidor next
  }
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  try {
    const prismic = getPrismicClient();
    const response = await prismic.getByUID("posts", String(params.slug), {});


    return {
      props: {
        post: response
      }
    }
  } catch {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }
};
