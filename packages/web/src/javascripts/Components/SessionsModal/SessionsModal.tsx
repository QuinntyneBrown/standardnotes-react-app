import { ViewControllerManager } from '@/Services/ViewControllerManager'
import { SNApplication, SessionStrings, UuidString, isNullOrUndefined, RemoteSession } from '@standardnotes/snjs'
import { FunctionComponent, useState, useEffect, useRef, useMemo } from 'react'
import { Alert } from '@reach/alert'
import { AlertDialog, AlertDialogDescription, AlertDialogLabel } from '@reach/alert-dialog'
import { WebApplication } from '@/Application/Application'
import { observer } from 'mobx-react-lite'
import ModalDialog from '../Shared/ModalDialog'
import ModalDialogLabel from '../Shared/ModalDialogLabel'
import ModalDialogDescription from '../Shared/ModalDialogDescription'

type Session = RemoteSession & {
  revoking?: true
}

function useSessions(
  application: SNApplication,
): [Session[], () => void, boolean, (uuid: UuidString) => Promise<void>, string] {
  const [sessions, setSessions] = useState<Session[]>([])
  const [lastRefreshDate, setLastRefreshDate] = useState(Date.now())
  const [refreshing, setRefreshing] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    ;(async () => {
      setRefreshing(true)
      const response = await application.getSessions()
      if ('error' in response || isNullOrUndefined(response.data)) {
        if (response.error?.message) {
          setErrorMessage(response.error.message)
        } else {
          setErrorMessage('An unknown error occured while loading sessions.')
        }
      } else {
        const sessions = response.data as RemoteSession[]
        setSessions(sessions)
        setErrorMessage('')
      }
      setRefreshing(false)
    })().catch(console.error)
  }, [application, lastRefreshDate])

  function refresh() {
    setLastRefreshDate(Date.now())
  }

  async function revokeSession(uuid: UuidString) {
    const sessionsBeforeRevoke = sessions

    const responsePromise = application.revokeSession(uuid)

    const sessionsDuringRevoke = sessions.slice()
    const toRemoveIndex = sessions.findIndex((session) => session.uuid === uuid)
    sessionsDuringRevoke[toRemoveIndex] = {
      ...sessionsDuringRevoke[toRemoveIndex],
      revoking: true,
    }
    setSessions(sessionsDuringRevoke)

    const response = await responsePromise
    if (isNullOrUndefined(response)) {
      setSessions(sessionsBeforeRevoke)
    } else if ('error' in response) {
      if (response.error?.message) {
        setErrorMessage(response.error?.message)
      } else {
        setErrorMessage('An unknown error occured while revoking the session.')
      }
      setSessions(sessionsBeforeRevoke)
    } else {
      setSessions(sessions.filter((session) => session.uuid !== uuid))
    }
  }

  return [sessions, refresh, refreshing, revokeSession, errorMessage]
}

const SessionsModalContent: FunctionComponent<{
  viewControllerManager: ViewControllerManager
  application: SNApplication
}> = ({ viewControllerManager, application }) => {
  const close = () => viewControllerManager.closeSessionsModal()

  const [sessions, refresh, refreshing, revokeSession, errorMessage] = useSessions(application)

  const [confirmRevokingSessionUuid, setRevokingSessionUuid] = useState('')
  const closeRevokeSessionAlert = () => setRevokingSessionUuid('')
  const cancelRevokeRef = useRef<HTMLButtonElement>(null)

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      }),
    [],
  )

  return (
    <>
      <ModalDialog onDismiss={close} className="sessions-modal max-h-[90vh]">
        <ModalDialogLabel
          headerButtons={
            <button className="border-0 font-bold text-info cursor-pointer" onClick={refresh}>
              Refresh
            </button>
          }
          closeDialog={close}
        >
          Active Sessions
        </ModalDialogLabel>
        <ModalDialogDescription className="overflow-y-auto">
          {refreshing ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 animate-spin border border-solid border-info border-r-transparent rounded-full"></div>
              <h2 className="sk-p sessions-modal-refreshing">Loading sessions</h2>
            </div>
          ) : (
            <>
              {errorMessage && <Alert className="sk-p bold">{errorMessage}</Alert>}
              {sessions.length > 0 && (
                <ul>
                  {sessions.map((session) => (
                    <li key={session.uuid}>
                      <h2 className="text-base font-bold">{session.device_info}</h2>
                      {session.current ? (
                        <span className="text-info font-bold">Current session</span>
                      ) : (
                        <>
                          <p>Signed in on {formatter.format(session.updated_at)}</p>
                          <button
                            className="bg-danger text-info-contrast font-bold px-2.5 py-2 text-xs"
                            disabled={session.revoking}
                            onClick={() => setRevokingSessionUuid(session.uuid)}
                          >
                            <span>Revoke</span>
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </ModalDialogDescription>
      </ModalDialog>
      {confirmRevokingSessionUuid && (
        <AlertDialog
          onDismiss={() => {
            setRevokingSessionUuid('')
          }}
          leastDestructiveRef={cancelRevokeRef}
          className="p-0"
        >
          <div className="sk-modal-content">
            <div className="sn-component">
              <div className="sk-panel">
                <div className="sk-panel-content">
                  <div className="sk-panel-section">
                    <AlertDialogLabel className="sk-h3 sk-panel-section-title">
                      {SessionStrings.RevokeTitle}
                    </AlertDialogLabel>
                    <AlertDialogDescription className="sk-panel-row">
                      <p>{SessionStrings.RevokeText}</p>
                    </AlertDialogDescription>
                    <div className="flex my-1 gap-2">
                      <button
                        className="bg-neutral text-info-contrast font-bold px-2.5 py-2 text-xs"
                        ref={cancelRevokeRef}
                        onClick={closeRevokeSessionAlert}
                      >
                        <span>{SessionStrings.RevokeCancelButton}</span>
                      </button>
                      <button
                        className="bg-danger text-info-contrast font-bold px-2.5 py-2 text-xs"
                        onClick={() => {
                          closeRevokeSessionAlert()
                          revokeSession(confirmRevokingSessionUuid).catch(console.error)
                        }}
                      >
                        <span>{SessionStrings.RevokeConfirmButton}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AlertDialog>
      )}
    </>
  )
}

const SessionsModal: FunctionComponent<{
  viewControllerManager: ViewControllerManager
  application: WebApplication
}> = ({ viewControllerManager, application }) => {
  if (viewControllerManager.isSessionsModalVisible) {
    return <SessionsModalContent application={application} viewControllerManager={viewControllerManager} />
  } else {
    return null
  }
}

export default observer(SessionsModal)
