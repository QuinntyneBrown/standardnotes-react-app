import HorizontalSeparator from '@/Components/Shared/HorizontalSeparator'
import { LinkButton, Subtitle } from '@/Components/Preferences/PreferencesComponents/Content'
import { WebApplication } from '@/Application/Application'
import { ListedAccount, ListedAccountInfo } from '@standardnotes/snjs'
import { FunctionComponent, useEffect, useState } from 'react'

type Props = {
  account: ListedAccount
  showSeparator: boolean
  application: WebApplication
}

const ListedAccountItem: FunctionComponent<Props> = ({ account, showSeparator, application }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [accountInfo, setAccountInfo] = useState<ListedAccountInfo>()

  useEffect(() => {
    const loadAccount = async () => {
      setIsLoading(true)
      const info = await application.getListedAccountInfo(account)
      setAccountInfo(info)
      setIsLoading(false)
    }
    loadAccount().catch(console.error)
  }, [account, application])

  return (
    <>
      <Subtitle className="em">{accountInfo?.display_name}</Subtitle>
      <div className="mb-2" />
      <div className="flex">
        {isLoading ? <div className="sk-spinner small info"></div> : null}
        {accountInfo && (
          <>
            <LinkButton className="mr-2" label="Open Blog" link={accountInfo.author_url} />
            <LinkButton className="mr-2" label="Settings" link={accountInfo.settings_url} />
          </>
        )}
      </div>
      {showSeparator && <HorizontalSeparator classes="mt-5 mb-3" />}
    </>
  )
}

export default ListedAccountItem
