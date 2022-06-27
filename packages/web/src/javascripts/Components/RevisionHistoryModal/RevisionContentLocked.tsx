import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import { HistoryLockedIllustration } from '@standardnotes/icons'
import Button from '@/Components/Button/Button'
import { SubscriptionController } from '@/Controllers/Subscription/SubscriptionController'

const getPlanHistoryDuration = (planName: string | undefined) => {
  switch (planName) {
    case 'Core':
      return '30 days'
    case 'Plus':
      return '365 days'
    default:
      return "the current session's changes"
  }
}

const getPremiumContentCopy = (planName: string | undefined) => {
  return `Version history is limited to ${getPlanHistoryDuration(planName)} in the ${planName} plan`
}

type Props = {
  subscriptionController: SubscriptionController
}

const RevisionContentLocked: FunctionComponent<Props> = ({ subscriptionController }) => {
  const { userSubscriptionName, isUserSubscriptionExpired, isUserSubscriptionCanceled } = subscriptionController

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-40%">
        <HistoryLockedIllustration />
        <div className="text-lg font-bold mt-2 mb-1">Can't access this version</div>
        <div className="mb-4 text-passive-0 leading-140%">
          {getPremiumContentCopy(
            !isUserSubscriptionCanceled && !isUserSubscriptionExpired && userSubscriptionName
              ? userSubscriptionName
              : 'free',
          )}
          . Learn more about our other plans to upgrade your history capacity.
        </div>
        <Button
          primary
          label="Discover plans"
          onClick={() => {
            if (window.plansUrl) {
              window.location.assign(window.plansUrl)
            }
          }}
        />
      </div>
    </div>
  )
}

export default observer(RevisionContentLocked)
