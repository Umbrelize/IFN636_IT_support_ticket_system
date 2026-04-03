const Ticket = require('../models/Ticket');

// USER: create ticket
const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and description are required' });
    }

    const ticket = await Ticket.create({
      user: req.user.id,
      subject,
      description,
      category,
      priority,
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: read own tickets
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: read one own ticket
const getMyTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: update own ticket
const updateMyTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    ticket.subject = req.body.subject || ticket.subject;
    ticket.description = req.body.description || ticket.description;
    ticket.category = req.body.category || ticket.category;
    ticket.priority = req.body.priority || ticket.priority;

    if (req.file) {
      ticket.image = `/uploads/${req.file.filename}`;
    }

    const updatedTicket = await ticket.save();

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER: delete own ticket
const deleteMyTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await ticket.deleteOne();
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: read all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: read any ticket by id
const getAnyTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('user', 'name email role');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: update any ticket
const updateAnyTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.subject = req.body.subject || ticket.subject;
    ticket.description = req.body.description || ticket.description;
    ticket.category = req.body.category || ticket.category;
    ticket.priority = req.body.priority || ticket.priority;
    ticket.status = req.body.status || ticket.status;

    if (req.file) {
      ticket.image = `/uploads/${req.file.filename}`;
    }

    const updatedTicket = await ticket.save();

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: delete any ticket
const deleteAnyTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await ticket.deleteOne();
    res.status(200).json({ message: 'Admin deleted ticket successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getMyTicketById,
  updateMyTicket,
  deleteMyTicket,
  getAllTickets,
  getAnyTicketById,
  updateAnyTicket,
  deleteAnyTicket,
};