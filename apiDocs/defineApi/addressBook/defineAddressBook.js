/**
 * Created by gunucklee on 2022. 01. 11.
 *
 * @swagger
 * definitions:
 *   Proc_Single_AddressBook:
 *     allOf:
 *       - $ref: '#/definitions/AddressBookTable'
 *
 *   AddressBookApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_AddressBook'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/addressbook/${path}"
 *         description: api 경로
 */



