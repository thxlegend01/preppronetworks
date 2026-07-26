Removed the "My Messages" and "DM Moderation" homepage buttons already. Next: turn PrepChat into one full social app instead of scattered entry points.

## What PrepChat becomes

A single app shell at `/prepchat` with a bottom tab bar:

```text
[ Feed ]  [ Explore ]  [ + Post ]  [ Chats ]  [ Profile ]
```

### 1. Feed (Instagram-style doubts)
- Vertical feed of doubt posts: author avatar + @username, image/photo of the doubt, caption, subject tag.
- Like, comment, save, share. Double-tap to like.
- Comment sheet with replies; tap author → their profile.
- Reuses the existing `community_posts` / `community_comments` / `community_reactions` tables, extended with subject tag + saves.

### 2. Explore
- Search users by @username, search posts by subject/tag.
- Suggested people, trending doubts, channel/group discovery.

### 3. + Post
- Upload photo of a doubt (existing `chat-media` bucket), caption, subject tag, post to feed.

### 4. Chats (Telegram-style)
One unified inbox listing:
- **DMs** — 1-on-1 threads (existing `direct_messages`).
- **Groups (GC)** — many-to-many chats users can create and invite friends to.
- **Channels** — broadcast: only admins/owner post, everyone else reads.
- **Study rooms** — the current PrepChat rooms fold in here as public groups.

Thread view supports: reply-to-message, emoji reactions, media/file, edit, delete for me / delete for everyone, pin, typing + online status, unread badges, mute.

### 5. Profile
- Avatar, @username, bio, post grid, followers/following counts, DM button, block/report.
- Own profile: edit details, saved posts, settings.

## Technical section

**Database (new migration):**
- `chat_conversations` — id, type (`dm` | `group` | `channel`), title, description, avatar_url, created_by, is_public.
- `chat_members` — conversation_id, user_id, role (`owner` | `admin` | `member`), joined_at, last_read_at, muted.
- `chat_messages` — conversation_id, sender_id, content, media fields, reply_to_id, is_edited, deleted_for[], deleted_for_everyone, pinned.
- `chat_message_reactions` — message_id, user_id, emoji.
- `post_saves`, plus `subject_tag` on `community_posts`.
- RLS: members-only read/write; channels restrict insert to owner/admin; existing `is_announcement_admin()` keeps platform-admin moderation access. GRANTs on every new table.
- Realtime enabled on `chat_messages`, `chat_members`, `chat_message_reactions`.

**Migration path:** existing `direct_messages` and `study_rooms`/`room_messages` are backfilled into the new conversation model so no chats are lost.

**Frontend:**
- New `src/pages/prepchat/` shell with nested routes: `/prepchat/feed`, `/explore`, `/new`, `/chats`, `/chats/:conversationId`, `/u/:username`.
- Shared hooks: `useConversations`, `useConversationMessages`, `useFeed`, `useFollow`.
- Old standalone `/dm`, `/dm/:userId`, `/community`, `/admin/dm-monitor` routes redirect into the new PrepChat sections; admin moderation moves inside PrepChat under an admin-only tab.
- Design: dark glass UI, pink accent, Framer Motion transitions, mobile-first, matching the existing PrepPro system.

## Build order
1. Migration + realtime + grants.
2. PrepChat shell, tab bar, routing, redirects.
3. Chats: inbox, DM threads, groups, channels, reactions/replies/deletes.
4. Feed + post composer + comments + likes/saves.
5. Explore, profiles, follow.
6. Admin moderation tab.
