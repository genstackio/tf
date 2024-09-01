jest.mock('../src/utils/getDirectories');
import tflayer from "../src/utils/tflayer";

import getDirectories from '../src/utils/getDirectories';

beforeEach(() => {
    jest.resetAllMocks();
})
describe('list-layers', () => {
    it('no directories outputs empty string', async () => {
        const logger = jest.fn();
        (getDirectories as jest.Mock<unknown>).mockImplementation(() => []);
        await tflayer({
            action: 'list-layers',
            env: 'dev',
            targetDir: '.',
            logger,
        });
        expect(logger).toHaveBeenCalledWith('');
    });
    it('one directory outputs dir name', async () => {
        const logger = jest.fn();
        const fetchLayer = jest.fn();
        (getDirectories as jest.Mock<unknown>).mockImplementation(() => ['dir1']);
        (fetchLayer as jest.Mock<unknown>).mockImplementation(() => [{}, '']);
        await tflayer({
            action: 'list-layers',
            env: 'dev',
            targetDir: '.',
            logger,
            fetchLayer,
        });
        expect(logger).toHaveBeenCalledWith('dir1');
    })
    it('multiple directories outputs dir names', async () => {
        const logger = jest.fn();
        const fetchLayer = jest.fn();
        (getDirectories as jest.Mock<unknown>).mockImplementation(() => ['dir1', 'dir2', 'dir3']);
        (fetchLayer as jest.Mock<unknown>).mockImplementation(() => [{}, '']);
        await tflayer({
            action: 'list-layers',
            env: 'dev',
            targetDir: '.',
            logger,
            fetchLayer,
        });
        expect(logger).toHaveBeenCalledWith("dir1\ndir2\ndir3");
    })
});
