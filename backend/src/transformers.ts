import { Folder, ServiceItem } from 'commons'

export function folderToServiceItem(folder: Folder): ServiceItem {
  return {
    type: folder.type,
    title: folder.title,
  }
}
