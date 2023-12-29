WIDTH=$(tput cols 2> /dev/null || echo 60)

print_boxed_string() {
  local string="$1"
  printf "┌%s┐\n" "$(printf "─%.0s" $(seq 1 $(($WIDTH-2))))"
  printf "│ %-*s│\n" $(($WIDTH-3)) "$string"
  printf "└%s┘\n" "$(printf "─%.0s" $(seq 1 $(($WIDTH-2))))"
}

echo_yellow() {
  local string="$1"
  printf "\e[33m%s\e[0m\n" "$string"
}

#! Sets up the environment for the project
print_boxed_string "SETTING UP ENVIRONMENT..."
# Update the package list to ensure we get the latest version of the packages
echo_yellow "$ apt-get update"
apt-get update
# Install the required packages
echo_yellow "$ apt-get install -y curl unzip gnupg"
apt-get install -y curl unzip gnupg

#! Install Fnm
print_boxed_string "INSTALLING FNM..."
# Install fnm
echo_yellow "$ curl -fsSL https://fnm.vercel.app/install | bash"
curl -fsSL https://fnm.vercel.app/install | bash
# Setup Fnm Path
echo_yellow "$ export PATH=\"/root/.local/share/fnm:\$PATH\""
export PATH="/root/.local/share/fnm:$PATH"
# Setup Node Path
echo_yellow "$ eval \"\`fnm env\`\""
eval "`fnm env`"
# Apply the changes to the current shell
echo_yellow "$ source /root/.bashrc"
source /root/.bashrc

#! Install Node.js & Yarn
print_boxed_string "INSTALLING NODE.JS & YARN..."
# Install Node.js v18.18.0
echo_yellow "$ fnm install v18.18.0"
fnm install v18.18.0
# Install Yarn
echo_yellow "$ corepack enable"
corepack enable

#! Install PostgreSQL
print_boxed_string "INSTALLING POSTGRESQL 16..."
# Add the PostgreSQL 16 repository
echo_yellow "$ sh -c 'echo \"deb http://apt.postgresql.org/pub/repos/apt \$(lsb_release -cs)-pgdg main\" > /etc/apt/sources.list.d/pgdg.list'"
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
# Import the repository signing key
echo_yellow "$ curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg"
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
# Update the package list
echo_yellow "$ apt-get update"
apt-get update
# Install PostgreSQL 16 and contrib modules
echo_yellow "$ apt-get install -y postgresql-16 postgresql-contrib-16"
apt-get install -y postgresql-16 postgresql-contrib-16

#! Setup the project
print_boxed_string "SETTING UP PROJECT..."
# Go to the project directory
echo_yellow "$ cd /autograder/source"
cd /autograder/source
# Install the required packages
echo_yellow "$ yarn install"
yarn install
# Install Playwright Chromium
echo_yellow "$ yarn playwright install chromium"
yarn playwright install chromium
# Install Playwright Chromium dependencies
echo_yellow "$ yarn playwright install-deps chromium"
yarn playwright install-deps chromium

#! Create Env File
print_boxed_string "CREATING ENV FILE..."
# Create .env.local
echo_yellow "Creating .env.local..."
echo "POSTGRES_URL=postgres://postgres:postgres@localhost:5432/hack2
AUTH_SECRET=this_is_a_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000" > /autograder/source/.env.local
