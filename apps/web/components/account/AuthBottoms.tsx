import {Button} from "../../@/components/ui/button";
import {AuthConfig, AuthType} from "../../const/oauth";

export default function AuthBottoms() {
  return (
      <div>
        {[AuthType.GITHUB, AuthType.NOTION,].map((value, index) => (
            <Button
                key={index}
                onClick={() => {
                  window.location.href = AuthConfig[value].getAuthLInk()
                }}
                variant={'outline'}
                className=" py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300"
            >
              {AuthConfig[value].label}
            </Button>
        ))}
      </div>
  )
}
