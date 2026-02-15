from fastapi import APIRouter
from app.database import task_collection
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()


# ==============================
# USER STATISTICS ENDPOINT
# ==============================
@router.get("/stats/{user_id}")
def user_stats(user_id: str):

    uid = ObjectId(user_id)

    total = task_collection.count_documents({"userId": uid})

    completed = task_collection.count_documents({
        "userId": uid,
        "status": "Completed"
    })

    pending = task_collection.count_documents({
        "userId": uid,
        "status": {"$ne": "Completed"}
    })

    completion_rate = (completed / total * 100) if total else 0

    pipeline = [
        {"$match": {"userId": uid}},
        {"$group": {
            "_id": "$priority",
            "count": {"$sum": 1}
        }}
    ]

    priority_data = list(task_collection.aggregate(pipeline))

    return {
        "total_tasks": total,
        "completed": completed,
        "pending": pending,
        "completion_rate": round(completion_rate, 2),
        "priority_distribution": priority_data
    }


# ==============================
# PRODUCTIVITY ENDPOINT
# ==============================
@router.get("/productivity/{user_id}")
def productivity(user_id: str):

    uid = ObjectId(user_id)

    last_7_days = datetime.utcnow() - timedelta(days=7)

    pipeline = [
        {
            "$match": {
                "userId": uid,
                "status": "Completed",
                "updatedAt": {"$gte": last_7_days}
            }
        },
        {
            "$group": {
                "_id": {
                    "day": {"$dayOfMonth": "$updatedAt"},
                    "month": {"$month": "$updatedAt"}
                },
                "count": {"$sum": 1}
            }
        }
    ]

    data = list(task_collection.aggregate(pipeline))

    return {"trend": data}
