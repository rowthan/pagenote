import { GetStaticPaths, GetStaticProps } from 'next'
import { DOCS, DocEntry } from '../../const/docs'
import DocsLayout, { DocArticle } from '../../components/DocsLayout'

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: DOCS.map((doc) => ({ params: { slug: [doc.slug] } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<{ doc: DocEntry }> = async ({ params }) => {
  const slug = Array.isArray(params?.slug) ? params?.slug.join('/') : params?.slug
  const doc = DOCS.find((item) => item.slug === slug)
  if (!doc) return { notFound: true }
  return { props: { doc } }
}

export default function DocPage({ doc }: { doc: DocEntry }) {
  return <DocsLayout activeSlug={doc.slug} title={doc.title} canonicalPath={`/docs/${doc.slug}`} description={doc.description}><DocArticle doc={doc} /></DocsLayout>
}
