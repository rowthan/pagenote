import {type ReactNode} from 'react';
import BasicLayout from "../layouts/BasicLayout";
import BindVipForm from "../components/form/BindVipForm";

interface Props {
    children?: ReactNode;
}

export default function expired1(props: Props) {

    return (
        <BasicLayout>
            <BindVipForm price={40}/>
        </BasicLayout>
    );
}
