export const handleRoute = (asyncFunc) => {
    return (req, res, next) => {
        (async () => {
            try {
                await asyncFunc(req, res, next)
            } catch (err) {
                next(err)
            }
        })()
    }
}
