
interface Err extends Error {
    status: number,
    data?: any
}

export default Err
