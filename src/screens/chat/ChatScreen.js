import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import AppHeader from '../../components/AppHeader';
import { fetchChatMessages, sendChatMessage } from '../../services/chatService';

const ChatScreen = ({ route, navigation }) => {
  const { userName, userId, postId } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = useSelector(getUserDataSelector);
  
  const currentUser = {
    _id: userData.userId,
    name: userData.userName || 'Me',
    avatar: userData.profilePic,
  };
  
  // Function to fetch messages - make it completely independent of component state
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetchChatMessages(postId, userData.userToken);
      
      if (response && !response.error) {
        if (response.data && Array.isArray(response.data)) {
          const formattedMessages = response.data.map(message => ({
            _id: message.id || Math.random().toString(36).substring(7),
            text: message.chat_message,
            createdAt: new Date(message.created_at),
            user: {
              _id: message.sender_id,
              name: message.sender_id === userData.userId ? userData.userName : userName,
              avatar: message.sender_id === userData.userId ? userData.profilePic : 'https://placeimg.com/140/140/any',
            },
          }));
          
          formattedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setMessages(formattedMessages);
        }
      } else {
        console.log('Error fetching chat data:', response?.message);
      }
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    } finally {
      setLoading(false);
    }
  }, [postId, userData.userToken, userData.userId, userName]); 

  useEffect(() => {
    // Initial fetch
    fetchMessages();
    
    // Set up interval to fetch messages every 30 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 30000);
    
    // Set up cleanup function
    return () => clearInterval(interval);
  }, [fetchMessages]); // Ensure fetchMessages is correctly referenced

  const onSend = useCallback(async (newMessages = []) => {
    if (newMessages.length === 0) return;
    
    // Update local messages immediately
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    
    try {
      const messageText = newMessages[0].text;
      
      const messageData = {
        post_bookings_id: postId,
        chat_id: 1,
        chat_type: "testing",
        sender_id: userData.userId,
        receiver_id: userId,
        chat_message: messageText
      };
  
      const response = await sendChatMessage(messageData, userData.userToken);
      
      if (response.error) {
        console.log('Error in response:', response.message);
      } else {
        // Use setTimeout to avoid immediate state updates that might conflict
        setTimeout(() => {
          fetchMessages();
        }, 300);
      }
    } catch (error) {
      console.log('Error in onSend function:', error.message);
    }
  }, [postId, userData.userId, userData.userToken, userId, fetchMessages]);

  
  const renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#005680',
        },
        left: {
          backgroundColor: '#f0f0f0',
        },
      }}
      textStyle={{
        right: {
          color: '#fff',
        },
        left: {
          color: '#000',
        },
      }}
    />
  );

  const renderSend = props => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <Ionicons name="send" size={24} color="#005680" />
      </View>
    </Send>
  );

  const renderInputToolbar = props => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
    />
  );

  const scrollToBottomComponent = () => (
    <Ionicons name="chevron-down" size={24} color="#005680" />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005680" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader 
        title={userName} 
        backIcon={true} 
        onBackPress={() => {
         
          try {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('MyTrips');
            }
          } catch (error) {
            console.log('Navigation error:', error);
            navigation.reset({
              index: 0,
              routes: [{ name: 'MyTrips' }],
            });
          }
        }} 
      />
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={currentUser}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        alwaysShowSend
        listViewProps={{
          initialNumToRender: 10,
          maxToRenderPerBatch: 10,
          windowSize: 10,
          keyboardShouldPersistTaps: 'handled',
          removeClippedSubviews: true,
        }}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#F8F8F8',
  },
});

export default ChatScreen;