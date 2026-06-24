const Conversation = require("../Models/ConvoModel");
const Message = require("../Models/MessageModel");

exports.GetConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    if (String(otherUserId) === String(req.user._id)) {
      return res.status(400).json({ message: "Cannot create a conversation with yourself" });
    }

    let conversation = await Conversation.findOne({
      members: { $all: [req.user._id, otherUserId] },
    })
      .populate("members", "username email avatar")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username avatar" },
      });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [req.user._id, otherUserId],
      });

      conversation = await Conversation.findById(conversation._id).populate(
        "members",
        "username email avatar",
      );
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getmyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ members: req.user._id })
      .populate("members", "username email avatar")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username avatar" },
      })
      .sort({ updatedAt: -1 });

    const conversationsWithUnreadCount = await Promise.all(
      conversations.map(async (conversation) => ({
        ...conversation.toObject(),
        unreadCount: await Message.countDocuments({
          conversation: conversation._id,
          sender: { $ne: req.user._id },
          readBy: { $ne: req.user._id },
        }),
      })),
    );

    res.json(conversationsWithUnreadCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getsingleConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      members: req.user._id,
    })
      .populate("members", "username email avatar")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username avatar" },
      });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
