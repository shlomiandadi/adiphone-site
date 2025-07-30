#!/bin/bash

echo "🚀 מתחיל לעדכן את כל הבראנצ'ים..."

# שמירת הבראנצ' הנוכחי
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 בראנצ' נוכחי: $CURRENT_BRANCH"

# רשימת הבראנצ'ים לעדכון
BRANCHES=(
    "production-official-with-ai-chatbot"
    "production-version-with-ai-chatbot-and-correct-business-name"
    "backup-latest-production"
    "backup-netlify-production"
)

# עדכון כל הבראנצ'ים
for branch in "${BRANCHES[@]}"; do
    echo ""
    echo "🔄 מעדכן בראנצ': $branch"
    
    # מעבר לבראנצ'
    git checkout $branch
    if [ $? -ne 0 ]; then
        echo "❌ שגיאה במעבר לבראנצ' $branch"
        continue
    fi
    
    # מיזוג עם development
    echo "📥 ממזג עם development..."
    git merge development
    if [ $? -ne 0 ]; then
        echo "❌ שגיאה במיזוג $branch"
        continue
    fi
    
    # דחיפה לשרת
    echo "📤 דוחף לשרת..."
    git push origin $branch
    if [ $? -ne 0 ]; then
        echo "❌ שגיאה בדחיפה $branch"
        continue
    fi
    
    echo "✅ $branch עודכן בהצלחה!"
done

# חזרה לבראנצ' המקורי
echo ""
echo "🔄 חוזר לבראנצ' המקורי: $CURRENT_BRANCH"
git checkout $CURRENT_BRANCH

echo ""
echo "🎉 סיום עדכון כל הבראנצ'ים!" 