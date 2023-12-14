import * as React from "react";
import CheckVersion from "../../components/check/CheckVersion";
import BasicLayout from "../../layouts/BasicLayout";
import Logs from "components/debug/Logs";

export default function Pages() {
    return (
        <BasicLayout nav={false} footer={false}>
            <CheckVersion requireVersion={'0.24.2'}>
                <Logs />
            </CheckVersion>
        </BasicLayout>
    )
}
