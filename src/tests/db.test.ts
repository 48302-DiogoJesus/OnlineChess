import ERRORS, { ErrorObject } from '../errors/errors'
import { 
    createUser,
    deleteUser,
    getUserPublic,
    updateUserPassword,
    updateUserPublic,
    userExists,
    validateCredentials
} from '../services'

describe('Services Tests', () => {

    const testUsername = '|T-e-s-t|U-s-e-r|'
    const testPassword = 'TestPassword'
    var testToken = ''

    const expectThrow = async (block: (...args: any[]) => any, ...args: any[]) => {
        try {
            await block(...args)
        } catch (err) {
            return (err as ErrorObject)
        }
    }

    beforeEach(async () => {
        try {
            testToken = await createUser(testUsername, testPassword)
        } catch {}
    })

    afterEach(async () => {
        try {
            await deleteUser(testToken, testUsername)
        } catch {}
    })

    describe('Users', () => {
        test('User exists unauthenticated', async () => {
            expect((await expectThrow(userExists, 'INVALID_TOKEN', testUsername))!!.message).toBe(ERRORS.INVALID_TOKEN.message)
        })

        test('User exists', async () => {
            expect(await userExists(testToken, testUsername)).toBeTruthy()
        })

        test('User does not exist', async () => {
            expect(await userExists(testToken, 'Some non existing user')).toBeFalsy()
        })

        test('Create valid User', async () => {
            const token2 = await createUser('Test User 2', 'Mypassword2')
            expect(token2).toBeDefined()
            await deleteUser(token2, 'Test User 2')
        })

        test('Create duplicate User', async () => {
            const token2 = await createUser('Test User 2', 'Mypassword2')
            expect(token2).toBeDefined()
            expect((await expectThrow(createUser, 'Test User 2', 'Mypassword5'))!!.message).toBe(ERRORS.USER_ALREADY_EXISTS.message)
            await deleteUser(token2, 'Test User 2')
        })

        test('Create user with invalid username 1', async () => {
            expect((await expectThrow(createUser, 'T-1', 'Mypassword5'))!!.message).toBe(ERRORS.INVALID_USERNAME_LENGTH.message)
        })

        test('Create user with invalid username 2', async () => {
            expect((await expectThrow(createUser, 'Test-123', 'Myp'))!!.message).toBe(ERRORS.INVALID_PASSWORD_LENGTH.message)
        })

        test('Get user rank', async () => {
            const rank = (await getUserPublic(testToken, testUsername)).rank
            expect(rank).toBeDefined()
            expect(rank).toBe("0")
        })

        test('Validate valid credentials', async () => {
            expect(await validateCredentials(testUsername, testPassword)).toBeTruthy()
        })

        test('Validate invalid credentials', async () => {
            expect((await expectThrow(validateCredentials, testUsername, 'NewPassword'))!!.message).toBe(ERRORS.WRONG_PASSWORD.message)
        })

        test('Validate credentials from unexisting user', async () => {
            expect((await expectThrow(validateCredentials, "asjhdksdfkksdjhfjksdfh", 'PASSWORD_HERE'))!!.message).toBe(ERRORS.USER_DOES_NOT_EXIST.message)
        })

        test('Update user password', async () => {
            await updateUserPassword(testToken, testUsername, 'NewPassword')
            expect(await validateCredentials(testUsername, 'NewPassword')).toBeTruthy()
        })

        test('Update user public rank', async () => {
            await updateUserPublic(testToken, testUsername, { rank: 92 })
            expect((await getUserPublic(testToken, testUsername)).rank).toBe("92")
        })
    })

    describe('Games', () => {

    })
})