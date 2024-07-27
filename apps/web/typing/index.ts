export interface PlanInfo {
  title: string
  description: string
  price: number

  unit?: string
  duration: string

  bg: string

  role: number

  deduct: boolean

  final?: boolean

  rights: {
    label: string
    allowed?: boolean
    disAllowLabel?: string
  }[]

  payments:{
    id: string,
    url: string,
    label:string
  }[]
}
