import type React from "react";
import type { User } from "@/lib/user";
import { Button } from "@/components/ui/button";

interface UserListProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onSelectUser }) => {
  return (
    <div className="space-y-2">
      {users.map((user) => (
        <Button
          key={user.id}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onSelectUser(user)}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <span className="text-blue-600 font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span>{user.username}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default UserList;
