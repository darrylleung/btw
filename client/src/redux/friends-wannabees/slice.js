export default function friendsWannabeesReducer(friends = [], action) {
    if (action.type === "/friends-wannabees/received") {
        friends = action.payload.friends;
    } else if (action.type === "/friends-wannabees/accept") {
        const { id } = action.payload;
        friends = friends.map((friend) => {
            if (friend.id === id) {
                friend = { ...friend, accepted: true };
            }
            return friend;
        });
    } else if (action.type === "/friends-wannabees/unfriend") {
        const { id } = action.payload;
        friends = friends.filter((friend) => {
            if (friend.id != id) {
                return friend;
            }
        });
    }
    return friends;
}

//actions go below

export function receiveFriendsAndWannabees(friends) {
    return {
        type: "/friends-wannabees/received",
        payload: { friends },
    };
}

export function acceptFriend(id) {
    return {
        type: "/friends-wannabees/accept",
        payload: { id },
    };
}

export function unfriend(id) {
    return {
        type: "/friends-wannabees/unfriend",
        payload: { id },
    };
}
