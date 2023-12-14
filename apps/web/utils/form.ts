/**
 * 从 form 元素中获取表单数据
 * */
export function getFormData<T>(form: HTMLFormElement) {
  const formData = new FormData(form)
  const data: Record<string, any> = {}
  for (const pair of formData.entries()) {
    data[pair[0]] = pair[1]
  }
  return data as T
}
