import React, {FC, PropsWithChildren, useEffect} from "react";

interface Props {
  css?: string
}

const Index: FC<PropsWithChildren<Props>> = (props) => {
    const {children} = props;

    useEffect(() => {
        console.log('effect')
    }, [])

    return (
        <div className="">
            {children}
        </div>
    );
}
export default Index
