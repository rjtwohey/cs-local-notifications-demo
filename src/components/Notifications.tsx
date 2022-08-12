import { IonButton, IonItem, IonLabel } from '@ionic/react';
import { useEffect, useState } from 'react';
import './Notifications.css';
import { CancelOptions, LocalNotificationDescriptor, LocalNotifications, LocalNotificationSchema, Schedule, ScheduleOptions } from '@capacitor/local-notifications'

interface ContainerProps { }

const Notifications: React.FC<ContainerProps> = () => {
  //Maintain a list of created notifications for debugging purposes
  const [notifications, setNotifications] = useState<LocalNotificationSchema[]>([]);
  const [index, setIndex] = useState<number>(0);

  //Setup permissions to allow notifications on device
  //Setup listeners required to receive notifications
  useEffect(() => {
    LocalNotifications.requestPermissions();

    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log(notification);
      setNotifications(notifications => [...notifications, notification])
    })
  }, [])

  useEffect(() => {
    console.log('notifications updated', notifications)
  }, [notifications])

  //Generate a notification that is scheduled at current time + 1 seconds
  const addNotification = () => {
    var t = new Date();
    t.setSeconds(t.getSeconds() + 1);
    const notificationSchedule: Schedule = {
      at: t,
      repeats: false
    }
    const notification: LocalNotificationSchema[] = [{
      title: 'Notification',
      id: index,
      body: 'blah',
      schedule: notificationSchedule
    }]
    const scheduleOptions: ScheduleOptions = {
      notifications: notification
    }
    LocalNotifications.schedule(scheduleOptions!)
    setIndex(index + 1);
  }

  //This will cancel the most recent notification in the queue.
  //First in last out method
  const cancelNotification = () => {
    const notificationsToCancel: LocalNotificationDescriptor[] = [{
      id: index
    }]
    const cancelOptions: CancelOptions = {
      notifications: notificationsToCancel
    }
    LocalNotifications.cancel(cancelOptions).then(() => {
      //Remove notification from our local notifications list
      console.log(index)
      const notificationIndex = notifications.findIndex(n => {return n.id === (index - 1)}) //because our current index is set to 1 higher than what we're at
      console.log(notificationIndex)
      if (notificationIndex !== -1) {
        const newNotificationsList = [...notifications]
        newNotificationsList.splice(notificationIndex, 1)
        setNotifications(newNotificationsList)
      }
      //Decrement the current index to appropriately reflect what the current notification id will be
      const newIndex = index > 0 ? index - 1 : 0
      setIndex(newIndex)
    }); //this returns void
  }

  return (
    <div className="container">
      <div>
        <IonLabel >Trigger Notificatcation</IonLabel>
        <IonButton onClick={addNotification}>Trigger</IonButton>
      </div>
      <div>
        <IonLabel>Cancel Notificatcation</IonLabel>
        <IonButton onClick={cancelNotification}>Cancel</IonButton>
      </div>
    </div>
  );
};

export default Notifications;
