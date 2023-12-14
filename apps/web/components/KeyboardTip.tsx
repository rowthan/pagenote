import useShortcut from "../hooks/useShortcut";
import {ReactElement} from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function KeyboardTip(props:{tip?: string,command?: string,children?: ReactElement}) {
    const {tip='',command='',children=null} = props;
    const [_commands,commandMap={}] = useShortcut();

    const shortcut = commandMap[command]?.shortcut;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent side={'top'}>
            <p>
              {tip} {shortcut}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
}
