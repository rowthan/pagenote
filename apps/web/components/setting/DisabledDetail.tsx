import { type ReactNode } from 'react'
import SettingDetail from './SettingDetail'
import ShortCutInfo from '../ShortCutInfo'
import useSettings from "../../hooks/useSettings";
import {AiOutlineDelete} from 'react-icons/ai'
import {Form, FormControl, FormField, FormItem, FormMessage} from "../../@/components/ui/form";
import {Input} from "../../@/components/ui/input";
import {Button} from "../../@/components/ui/button";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import set from "lodash/set";
interface Props {
  children?: ReactNode
}

const FormSchema = z.object({
  rule: z.string().min(4, {
    message: "最少4字符",
  }),
})

export default function DisabledDetail(props: Props) {
  const { children } = props
    const { data, update: updateSetting } = useSettings()
    const {disableList=[]} = data || {}

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rule: '',
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const ruleSet = new Set(disableList)
    ruleSet.add(data.rule)
    updateSetting({
      disableList: Array.from(ruleSet),
    })
  }

  function removeRule(rule: string) {
    const ruleSet = new Set(disableList)
    ruleSet.delete(rule)
    updateSetting({
      disableList: Array.from(ruleSet),
    })
  }

    return (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6 mb-4">
              <FormField
                  control={form.control}
                  name="rule"
                  render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <div className={'flex justify-between'}>
                            <Input className={'w-4/5'} placeholder="禁用匹配网址。如 https://pagenote.cn/*" {...field} />
                            <Button variant="destructive" type={'submit'}>保存</Button>
                          </div>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
            </form>
          </Form>

          {
            disableList.map((item, index) => {
              return (
                  <div className={'flex items-center justify-between text-sm p-2 rounded hover:bg-card border-b'}
                       key={index}>
                    <span className={'max-w-4/5 overflow-hidden'}>{item}</span>
                    <button onClick={() => {
                      removeRule(item)
                    }}>
                      <AiOutlineDelete/>
                    </button>
                  </div>
              )
            })
          }

          <div className={'text-sm text-muted-foreground mt-8'}>
            <h3>例：</h3>
            <ul className={'px-2'}>
              <li>
                https://pagenote.cn (仅作用于单个网页地址)
              </li>
              <li>
                https://pagenote.cn/* (作用于多个网页)
              </li>
            </ul>
          </div>
        </div>
    )
}

