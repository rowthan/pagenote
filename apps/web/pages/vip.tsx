import {type ReactNode} from 'react';
import NotionContent from "../components/notion/NotionContent";
import { getNotionDocDetail } from 'service/server/doc';
import { NotionDocProp } from 'components/notion/NotionDoc';

interface Props {
    children?: ReactNode;
}
const NOTION_DOC_ID = '/pro-plan/tips'
// This function gets called at build time
export async function getStaticProps() {
    // Call an external API endpoint to get posts
    const res = await getNotionDocDetail(NOTION_DOC_ID)   
    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return res;
}

export default function expired1(props: NotionDocProp) {
    return (
        <div className="">
            {/*https://page-note.notion.site/da8bdda50ec344f488d7c84ba52faea5?pvs=4*/}
            <NotionContent
                docId={NOTION_DOC_ID}
                notionDoc={props}
                // docId={'97d2bd1d27284a9da670fdfb9b25d0fe'}
            />
        </div>
    );
}
