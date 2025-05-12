class StafController {
    index (req, res) {
        res.render ("staff/staff")
    }
}

module.exports = new StafController()