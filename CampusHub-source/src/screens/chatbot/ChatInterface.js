import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Avatar, Card, Title } from 'react-native-paper';

const ChatInterface = () => {
  const [message, setMessage] = React.useState('');
  const [chatHistory, setChatHistory] = React.useState([
    {
      id: '1',
      message: 'Hello! How can I help you with CampusHub today?',
      isUserMessage: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5)
    }
  ]);
  const [loading, setLoading] = React.useState(false);

  const scrollViewRef = React.useRef();

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      isUserMessage: true,
      createdAt: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      let botResponse = "I'm sorry, I don't understand that question.";

      if (message.toLowerCase().includes('class') || message.toLowerCase().includes('room')) {
        botResponse = "You can find classroom information in the Classrooms tab. You can view available classrooms and their locations on the map.";
      } else if (message.toLowerCase().includes('book') || message.toLowerCase().includes('facility')) {
        botResponse = "To book a facility, go to the Facilities tab, select a facility, and choose an available time slot.";
      } else if (message.toLowerCase().includes('event')) {
        botResponse = "Check out the Events tab to see upcoming university events. You can register for events that interest you.";
      } else if (message.toLowerCase().includes('food') || message.toLowerCase().includes('restaurant')) {
        botResponse = "The Food tab shows all campus restaurants and their menus. You can browse by cuisine type.";
      } else if (message.toLowerCase().includes('complaint')) {
        botResponse = "To submit a complaint, go to the Complaints tab and fill out the form with details about your issue.";
      } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        botResponse = "Hello! How can I help you with CampusHub today?";
      }

      const botMessageObj = {
        id: (Date.now() + 1).toString(),
        message: botResponse,
        isUserMessage: false,
        createdAt: new Date()
      };

      setChatHistory(prev => [...prev, botMessageObj]);
      setLoading(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContent}
      >
        {chatHistory.map((chat) => (
          <View
            key={chat.id}
            style={[
              styles.messageContainer,
              chat.isUserMessage ? styles.userMessageContainer : styles.botMessageContainer
            ]}
          >
            {!chat.isUserMessage && (
              <Avatar.Text
                size={40}
                label="CH"
                style={styles.botAvatar}
                color="#fff"
                backgroundColor="#003366"
              />
            )}
            <View
              style={[
                styles.messageBubble,
                chat.isUserMessage ? styles.userMessageBubble : styles.botMessageBubble
              ]}
            >
              <Text style={[styles.messageText, chat.isUserMessage && styles.userMessageText]}>
                {chat.message}
              </Text>
              <Text style={styles.messageTime}>{formatTime(chat.createdAt)}</Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={[styles.messageContainer, styles.botMessageContainer]}>
            <Avatar.Text
              size={40}
              label="CH"
              style={styles.botAvatar}
              color="#fff"
              backgroundColor="#003366"
            />
            <View style={[styles.messageBubble, styles.botMessageBubble, styles.typingBubble]}>
              <Text style={styles.typingText}>Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <Card style={styles.inputCard}>
        <Card.Content style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            style={styles.input}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleSendMessage}
                disabled={!message.trim() || loading}
                color="#003366"
              />
            }
            onSubmitEditing={handleSendMessage}
          />
        </Card.Content>
      </Card>

      <Card style={styles.helpCard}>
        <Card.Content>
          <Title style={styles.helpTitle}>Quick Questions</Title>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Button
              mode="outlined"
              onPress={() => setMessage("How do I book a facility?")}
              style={styles.suggestionButton}
            >
              How do I book a facility?
            </Button>
            <Button
              mode="outlined"
              onPress={() => setMessage("Where can I find available classrooms?")}
              style={styles.suggestionButton}
            >
              Find classrooms
            </Button>
            <Button
              mode="outlined"
              onPress={() => setMessage("What events are happening this week?")}
              style={styles.suggestionButton}
            >
              Events this week
            </Button>
            <Button
              mode="outlined"
              onPress={() => setMessage("How do I submit a complaint?")}
              style={styles.suggestionButton}
            >
              Submit a complaint
            </Button>
          </ScrollView>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  chatContent: {
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userMessageBubble: {
    backgroundColor: '#003366',
    borderBottomRightRadius: 4,
  },
  botMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  userMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  typingText: {
    fontStyle: 'italic',
    color: '#666',
  },
  inputCard: {
    margin: 8,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
  },
  helpCard: {
    margin: 8,
    marginTop: 0,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  suggestionButton: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default ChatInterface;
