const spaceDAO = require('../../dao/space.dao');

class SpaceController {
    async create(req, res) {
        try {
            const { name, address, max_capacity, conservation_status, administrative_unit, description } = req.body;

            if (!name || !address || !max_capacity || !administrative_unit) {
                return res.status(400).json({
                    success: false,
                    message: 'Required fields: name, address, max_capacity, administrative_unit'
                });
            }

            const newSpace = await spaceDAO.create({
                name, address, max_capacity: parseInt(max_capacity),
                conservation_status: conservation_status || 'operational',
                administrative_unit, description
            });

            res.status(201).json({ success: true, data: newSpace });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async list(req, res) {
        try {
            const spaces = await spaceDAO.findOperational();
            res.json({ success: true, count: spaces.length, data: spaces });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new SpaceController();