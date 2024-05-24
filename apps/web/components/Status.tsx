import {type ReactNode} from 'react';
import classNames from "classnames";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiLoader2Line } from "react-icons/ri";
import { BiLoaderCircle } from "react-icons/bi";
import { RiLoaderLine } from "react-icons/ri";

interface Props {
    children?: ReactNode;
    disabled?:boolean
}

export default function Status(props: Props) {
    const {children,disabled} = props;
    return (
        <div className={
            classNames('relative rounded-lg w-6 h-6  ',{
                "grayscale": disabled
            })
        }>
            {/*<div className={'w-full h-full animate-spin animation-duration-[5s] bg-gray-800 bg-opacity-20 absolute top-0 left-0  rounded-xl'}>*/}
            {/*    <RiLoaderLine fill={'#fff'} className={'w-full h-full'}></RiLoaderLine>*/}
            {/*</div>*/}
            {children}
        </div>
    );
}

