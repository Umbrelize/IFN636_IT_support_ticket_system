const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const {
  createTicket,
  getMyTickets,
  getMyTicketById,
  updateMyTicket,
  deleteMyTicket,
  getAllTickets,
  getAnyTicketById,
  updateAnyTicket,
  deleteAnyTicket,
} = require('../controllers/ticketController');

// USER routes
router.route('/')
  .post(protect, upload.single('image'), createTicket)
  .get(protect, getMyTickets);

router.route('/:id')
  .get(protect, getMyTicketById)
  .put(protect, upload.single('image'), updateMyTicket)
  .delete(protect, deleteMyTicket);

// ADMIN routes
router.get('/admin/all', protect, adminOnly, getAllTickets);
router.get('/admin/:id', protect, adminOnly, getAnyTicketById);
router.put('/admin/:id', protect, adminOnly, upload.single('image'), updateAnyTicket);
router.delete('/admin/:id', protect, adminOnly, deleteAnyTicket);

module.exports = router;