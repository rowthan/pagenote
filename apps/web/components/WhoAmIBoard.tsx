import CheckVersion from "./check/CheckVersion";
import useWhoAmi from "../hooks/useWhoAmi";

export default function WhoAmIBoard() {
    const [whoAmI] = useWhoAmi();
    return(
        <CheckVersion requireVersion={'0.24.0'}>
            <div className="overflow-x-auto">
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th>属性</th>
                            <th>值</th>
                         </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>插件名称</th>
                        <td>{whoAmI?.name}</td>
                    </tr>
                    <tr>
                        <th>插件ID</th>
                        <td>{whoAmI?.extensionId}</td>
                    </tr>
                    <tr>
                        <th>设备ID</th>
                        <td>{whoAmI?.did}</td>
                    </tr>
                    <tr>
                        <th>插件版本</th>
                        <td>{whoAmI?.version}</td>
                    </tr>
                    <tr>
                        <th>插件平台</th>
                        <td>{whoAmI?.extensionPlatform}</td>
                    </tr>
                    <tr>
                        <th>浏览器</th>
                        <td>{whoAmI?.browserType}</td>
                    </tr>
                    <tr>
                        <th>浏览器版本</th>
                        <td>{whoAmI?.browserVersion}</td>
                    </tr>
                    <tr>
                        <th>语种</th>
                        <td>{whoAmI?.language}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </CheckVersion>
    )
}
