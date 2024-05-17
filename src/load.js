import { findReference } from '@sumor/config'

export default async root => {
  const meta = await findReference(`${root}`, ['js'])
  // console.log(`${root}`, meta)
  return meta
}
