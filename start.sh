mkdir -p logs

kill `ps aux | grep "services/translation_service/main.py" | grep -v "grep" | awk '{print $2}'`
kill `ps aux | grep "services/user_info_service/main.py" | grep -v "grep" | awk '{print $2}'`
kill `ps aux | grep "node index.js" | grep -v "grep" | awk '{print $2}'`

python services/translation_service/main.py 2>&1 | tee logs/translation_service.log &
python services/user_info_service/main.py 2>&1 | tee logs/user_info_service.log &
node index.js &
