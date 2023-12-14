interface Node{
    rounded: boolean
    className: string,
    children?: Node[]
}
interface LoadingProps {
    nodes:Node[]
}


export default function Loading() {
    return(
        <div className="w-full bg-white rounded-md shadow-xl">
            <div className="h-44 bg-gray-300 rounded-t-md animate-pulse"></div>
            <div className="p-5">
                <div className="h-6 rounded-sm bg-gray-200 duration-75 animate-pulse mb-4"></div>
                <div className="animate-pulse">
                    <div className="h-1 mt-2 w-1/2 rounded-sm bg-gray-300"></div>
                    <div className="h-1 mt-2 w-1/3 rounded-sm bg-gray-300"></div>
                    <div className="h-1 mt-2 w-2/3 rounded-sm bg-gray-300"></div>
                    <div className="h-1 mt-2 rounded-sm bg-gray-300"></div>
                    <div className="h-1 mt-2 rounded-sm bg-gray-300"></div>
                    <div className="h-1 mt-2 rounded-sm bg-gray-300"></div>
                    <div className="h-2 rounded-sm bg-gray-300"></div>
                </div>
            </div>
        </div>
    )
}
