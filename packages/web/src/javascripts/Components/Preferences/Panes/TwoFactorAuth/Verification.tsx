import Button from '@/Components/Button/Button'
import DecoratedInput from '@/Components/Input/DecoratedInput'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'react'
import Bullet from './Bullet'
import { TwoFactorActivation } from './TwoFactorActivation'
import ModalDialog from '@/Components/Shared/ModalDialog'
import ModalDialogButtons from '@/Components/Shared/ModalDialogButtons'
import ModalDialogDescription from '@/Components/Shared/ModalDialogDescription'
import ModalDialogLabel from '@/Components/Shared/ModalDialogLabel'

type Props = {
  activation: TwoFactorActivation
}

const Verification: FunctionComponent<Props> = ({ activation: act }) => {
  const secretKeyClass = act.verificationStatus === 'invalid-secret' ? 'border-danger' : ''
  const authTokenClass = act.verificationStatus === 'invalid-auth-code' ? 'border-danger' : ''
  return (
    <ModalDialog>
      <ModalDialogLabel closeDialog={act.cancelActivation}>Step 3 of 3 - Verification</ModalDialogLabel>
      <ModalDialogDescription className="h-33 flex flex-row items-center">
        <div className="flex-grow flex flex-col">
          <div className="flex flex-row items-center mb-4">
            <Bullet />
            <div className="min-w-1" />
            <div className="text-sm">
              Enter your <b>secret key</b>:
            </div>
            <div className="min-w-2" />
            <DecoratedInput className={`w-92 ${secretKeyClass}`} onChange={act.setInputSecretKey} />
          </div>
          <div className="flex flex-row items-center">
            <Bullet />
            <div className="min-w-1" />
            <div className="text-sm">
              Verify the <b>authentication code</b> generated by your authenticator app:
            </div>
            <div className="min-w-2" />
            <DecoratedInput className={`w-30 ${authTokenClass}`} onChange={act.setInputOtpToken} />
          </div>
        </div>
      </ModalDialogDescription>
      <ModalDialogButtons>
        {act.verificationStatus === 'invalid-auth-code' && (
          <div className="text-sm text-danger flex-grow">Incorrect authentication code, please try again.</div>
        )}
        {act.verificationStatus === 'invalid-secret' && (
          <div className="text-sm text-danger flex-grow">Incorrect secret key, please try again.</div>
        )}
        <Button className="min-w-20" label="Back" onClick={act.openSaveSecretKey} />
        <Button className="min-w-20" primary label="Next" onClick={act.enable2FA} />
      </ModalDialogButtons>
    </ModalDialog>
  )
}

export default observer(Verification)
