import { GuiNotificationsService } from './gui-notifications.service';

describe('JsSip service', () => {
    const notificationService = new GuiNotificationsService();
    it('should triger a notification', () => {
        notificationService.get().subscribe(data => {
            expect(data.text).toEqual('test');
        });
        notificationService.send({text: 'test'});
    });
});
