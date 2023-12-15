import { useForm } from 'react-hook-form'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'

export type CommonFormField = {
  type?: 'text' | string
  name: string
  options?: RegisterOptions<any>
  placeholder?: string
  label?: string
}

interface Props {
  fields: CommonFormField[]
  onSubmit: (data: any) => void
  loading?: boolean
  value: any
}

export default function CommonForm(props: Props) {
  const { fields, onSubmit, loading, value } = props
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: value,
  })

  return (
    <div>
      <form
        className="flex flex-col gap-4 items-center "
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        {fields.map((item, index) => (
          <div key={item.name} className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">{item.label}</span>
              {/*<span className="label-text-alt">Top Right label</span>*/}
            </label>
            <input
              type={item.type || 'text'}
              autoFocus={true}
              className="p-2 mb-1 rounded-xl border"
              {...register(item.name, item.options)}
              placeholder={item.placeholder}
            />
            {/*<label className="label">*/}
            {/*    <span className="label-text-alt">Bottom Left label</span>*/}
            {/*    <span className="label-text-alt">Bottom Right label</span>*/}
            {/*</label>*/}
          </div>
        ))}

        <button
          className={`bg-[#002074] rounded-xl py-2 text-white max-w-full px-10  hover:scale-105 duration-300 btn btn-sm ${
            loading ? 'loading' : ''
          }`}
        >
          保存
        </button>
      </form>
    </div>
  )
}
