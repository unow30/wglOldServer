/**
 * Created by gunucklee on 2022. 01. 11.
 *
 * @swagger
 * definitions:
 *   Proc_Array_AddressBook:
 *     allOf:
 *       - $ref: '#/definitions/AddressBookTable'
 *
 *   AddressBookListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_AddressBook'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/addressbook/${path}"
 *         description: api 경로
 */



