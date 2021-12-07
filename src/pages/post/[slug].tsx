import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import { FiCalendar, FiUser, FiClock } from "react-icons/fi";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Prismic from "@prismicio/client";
import Head from "next/head";
import styles from './post.module.scss';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  
  const wordCount = post.data.content.reduce((prev, current) => {
    
    const headLenght = current.heading ? current.heading.split(" ").length : 0;
    const bodyLenght = current.body.reduce((prev, current) => {
      const textLenght = current.text ? current.text.split(" ").length : 0;

      return prev + textLenght;
    }, 0);

    return prev + headLenght + bodyLenght;
  }, 0);

  const readTimingMinutes = Math.ceil(wordCount / 200) + " Min"

  

  if(router.isFallback) {
    return (
      <main className={styles.container}>
        <div className={commonStyles.contentWrapper}>
          <Head>
            <title>SpaceTraveling | Loading...</title>
          </Head>
          <h2>Carregando...</h2>
        </div>
      </main>
    )
  }

  return (
    <>
    <main className={styles.container}>
      <div className={commonStyles.contentWrapper}>
        <article>
          <Head>
            <title>SpaceTraveling | {post.data.title}</title>
          </Head>

          <img src={post.data.banner.url} alt="BannerPost" />

          <h1>{post.data.title}</h1>
          <div className={commonStyles.infoSession}>
            <span><FiCalendar/>{post.first_publication_date}</span>
            <span><FiUser/>{post.data.author}</span>
            <span><FiClock/>{readTimingMinutes}</span>
          </div>

          {post.data.content.map((content, i) => (
            <div className={styles.group} key={content.heading || i}>
              <h2>{content.heading}</h2>
              {content.body.map((text, x) => (
                <p key={text.text || `${i}${x}`}>{text.text}</p>
              ))}
            </div>
          ))}


        </article>
        

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
    const publicationDate = format(
      new Date(response.first_publication_date),
      "dd MMM yyyy",
      {
        locale: ptBR,
      }
    )

    const post: Post = {
      first_publication_date: publicationDate,
      data: response.data
    }

    return {
      props: {
        post: post
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
