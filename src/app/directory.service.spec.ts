import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpModule,
  Http,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';

import { MockBackend } from '@angular/http/testing';
import { DirectoryService } from './directory.service';

const testData = [{
    title: 'Pearl Lagoon Directory',
    items: [{
        number: 49927,
        title: 'Green Lodge',
        subtitle: ''
    }]
}];

describe('Directory service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [HttpModule],
        providers: [
            DirectoryService,
            { provide: XHRBackend, useClass: MockBackend },
        ]
        });
    });

    describe('Get directory', () => {
        it('should get a list of phone numbers',
            inject([DirectoryService, XHRBackend], (directoryService, mockBackend) => {

            const mockResponse = testData;

            mockBackend.connections.subscribe((connection) => {
            connection.mockRespond(new Response(new ResponseOptions({
                body: JSON.stringify(mockResponse)
            })));
            });

            directoryService
                .get()
                .subscribe(res => {
                    res.subscribe(data => {
                        expect(data[0].title).toEqual('Pearl Lagoon Directory');
                        expect(data).toEqual(testData);
                    });
                });

            })
        );
    });
});
