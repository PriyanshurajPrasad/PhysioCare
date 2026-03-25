/**
 * Server-Sent Events (SSE) Utility
 * Manages real-time connections for admin dashboard updates
 */

class SSEManager {
  constructor() {
    this.connections = new Map(); // adminId -> Set of connections
  }

  /**
   * Add a new SSE connection
   */
  addConnection(adminId, req, res) {
    if (!this.connections.has(adminId)) {
      this.connections.set(adminId, new Set());
    }
    this.connections.get(adminId).add(res);
    console.log(`🔌 SSE: Added connection for admin ${adminId}, total connections: ${this.connections.get(adminId).size}`);
  }

  /**
   * Remove an SSE connection
   */
  removeConnection(adminId, res) {
    const adminConnections = this.connections.get(adminId);
    if (adminConnections) {
      adminConnections.delete(res);
      console.log(`🔌 SSE: Removed connection for admin ${adminId}, remaining: ${adminConnections.size}`);
      
      // Clean up if no more connections for this admin
      if (adminConnections.size === 0) {
        this.connections.delete(adminId);
      }
    }
  }

  /**
   * Emit event to all connections for an admin
   */
  emitToAdmin(adminId, event, data) {
    const adminConnections = this.connections.get(adminId);
    if (!adminConnections || adminConnections.size === 0) {
      return;
    }

    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    
    adminConnections.forEach(connection => {
      try {
        connection.write(message);
      } catch (error) {
        console.error('❌ SSE: Failed to send event:', error);
        // Remove dead connection
        this.removeConnection(adminId, connection);
      }
    });
  }

  /**
   * Emit new message event
   */
  emitNewMessage(messageData) {
    this.emitToAdmin(messageData.adminId, 'new_message', {
      messageId: messageData._id,
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject,
      createdAt: messageData.createdAt
    });
  }

  /**
   * Get connection count for an admin
   */
  getConnectionCount(adminId) {
    const adminConnections = this.connections.get(adminId);
    return adminConnections ? adminConnections.size : 0;
  }
}

// Singleton instance
const sseManager = new SSEManager();

module.exports = sseManager;
