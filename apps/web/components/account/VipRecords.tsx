import {type ReactNode} from 'react';
import BookList from "./BookList";

interface Props {
    children?: ReactNode;
}

export default function VipRecords(props: Props) {
    const {children} = props;
    return (
        <div className="">
            <BookList />
        </div>
    );
}

